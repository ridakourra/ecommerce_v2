<?php

namespace App\Http\Controllers;

use App\Models\DetailsUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PDO;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by first name
        if ($request->filled('first_name')) {
            $query->where('first_name', 'like', '%' . $request->first_name . '%');
        }

        // Filter by last name
        if ($request->filled('last_name')) {
            $query->where('last_name', 'like', '%' . $request->last_name . '%');
        }

        // Filter by email
        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        // Filter by role
        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by country
        if ($request->filled('country') && $request->country !== 'all') {
            $query->whereHas('details', function ($q) use ($request) {
                $q->where('country', $request->country);
            });
        }

        $users = $query->with('details')->paginate(5)->withQueryString();

        return Inertia::render('users/Index', [
            'users' => $users,
            'filters' => $request->only(['first_name', 'last_name', 'email', 'role', 'country']),
        ]);
    }

    public function create()
    {
        return Inertia::render('users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255|regex:/^[^\s]+$/',
            'last_name' => 'required|string|max:255|regex:/^[^\s]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable'
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role']
        ]);

        if ($user) {
            $path = null;
            if ($request->hasFile('avatar')) {
                $path = $request->file('avatar')->store('avatars', 'public');
            }
            DetailsUser::create([
                'user_id' => $user->id,
                'country' => $request->input('country'),
                'city' => $request->input('city'),
                'address' => $request->input('address'),
                'phone' => $request->input('phone'),
                'date_birth' => $request->input('date_birth'),
                'avatar' => $path,
            ]);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    public function show(string $id)
    {
        $user = User::with('details')->findOrFail($id);
        return Inertia::render('users/Show', ['user' => $user]);
    }

    public function edit(string $id)
    {
        abort(404);
    }


    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'nullable|string|in:customer,seller,admin',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'date_birth' => 'nullable|date',
        ]);

        // Update user
        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        // Update or create user details
        $user->details()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'country' => $validated['country'],
                'city' => $validated['city'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'date_birth' => $validated['date_birth'],
            ]
        );

        return back()->with('success', 'User updated successfully');
    }


    public function updatePassword(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully');
    }


    public function updateAvatar(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'avatar' => 'required|image|max:1024', // 1MB Max
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->details?->avatar) {
                Storage::disk('public')->delete($user->details->avatar);
            }

            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');

            // Update or create user details
            $user->details()->updateOrCreate(
                ['user_id' => $user->id],
                ['avatar' => $path]
            );
        }

        return back()->with('success', 'Avatar updated successfully');
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Delete the user's avatar if it exists
        if ($user->details?->avatar) {
            Storage::disk('public')->delete($user->details->avatar);
        }

        // Delete user details
        $user->details()->delete();

        // Delete the user
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
}
