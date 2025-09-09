<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'details',
        'screenshot',
    ];

    // Each submission belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}