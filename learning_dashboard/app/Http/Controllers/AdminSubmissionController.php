<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Submission;

class AdminSubmissionController extends Controller
{
    // ✅ View all submissions
    public function index()
    {
        $submissions = Submission::with('user')->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ]);
    }

    // ✅ Update submission status (approve/reject)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
        ]);

        $submission = Submission::findOrFail($id);
        $submission->status = $request->status;
        $submission->save();

        return response()->json([
            'status' => 'success',
            'message' => "Submission updated to {$submission->status}",
            'data' => $submission
        ]);
    }

    // ✅ Delete a submission
    public function destroy($id)
    {
        $submission = Submission::findOrFail($id);
        $submission->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Submission deleted successfully'
        ]);
    }
}
