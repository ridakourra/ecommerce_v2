<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailsUser extends Model
{
    protected $fillable = [
        'user_id',
        'country',
        'city',
        'address',
        'phone',
        'date_birth',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
