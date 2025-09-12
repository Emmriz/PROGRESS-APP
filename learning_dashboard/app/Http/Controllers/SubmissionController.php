<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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


    public function update(Request $request, Submission $submission)
    {
        // ensure the authenticated user owns this submission
        if ($submission->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'details' => 'required|string',
            'screenshot' => 'nullable|image|max:2048',
        ]);

        // handle optional new screenshot
        $path = $submission->screenshot_path;
        if ($request->hasFile('screenshot')) {
            // delete old file if exists
            if ($path) {
                Storage::disk('public')->delete($path);
            }
            $path = $request->file('screenshot')->store('submissions', 'public');
        }

        $submission->update([
            'details' => $request->details,
            'screenshot_path' => $path,
        ]);

        return response()->json([
            'message' => 'Submission updated successfully',
            'data' => $submission
        ], 200);
    }

    public function destroy(Submission $submission)
    {
        // ensure the authenticated user owns this submission
        if ($submission->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // delete file if exists
        if ($submission->screenshot_path) {
            Storage::disk('public')->delete($submission->screenshot_path);
        }

        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully'], 200);
    }


    
}
