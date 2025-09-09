<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    // List submissions (admin can see all, learner sees theirs)
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return Submission::with('user')->latest()->get();
        }

        return Submission::where('user_id', $user->id)->latest()->get();
    }

    // Store new submission
    public function store(Request $request)
    {
        $request->validate([
            'notes' => 'required|string',
            'screenshot' => 'nullable|image|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('screenshots', 'public');
        }

        return Submission::create([
            'user_id' => Auth::id(),
            'notes' => $request->notes,
            'screenshot_path' => $path,
        ]);
    }
}

