<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    // GET /api/submissions
    public function index()
    {
        $submissions = Submission::where('user_id', Auth::id())->get();

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ], 200);
    }

    // POST /api/submissions
    public function store(Request $request)
    {
        $request->validate([
            'details' => 'required|string',
            'screenshot' => 'nullable|image|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('submissions', 'public');
        }

        $submission = Submission::create([
            'user_id' => Auth::id(),
            'details' => $request->details,
            'screenshot' => $path,
            'status' => 'pending', // default status
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Submission created successfully',
            'data' => $submission
        ], 201);
    }

    
}
