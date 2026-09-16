<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicineController extends Controller
{
    private function checkAuth()
    {
        if (!Auth::check()) {
            abort(response()->json([
                'error' => 'Unauthorized access blocked. You must be logged in as pharmacist to view or modify data.',
            ], 401));
        }
    }

    public function index()
    {
        $this->checkAuth();

        $medicines = Medicine::orderBy('created_at', 'desc')->get();
        return response()->json($medicines);
    }

    public function store(Request $request)
    {
        $this->checkAuth();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $medicine = Medicine::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicine added successfully',
            'data' => $medicine,
        ], 201);
    }

    public function show($id)
    {
        $this->checkAuth();

        $medicine = Medicine::findOrFail($id);
        return response()->json($medicine);
    }

    public function update(Request $request, $id)
    {
        $this->checkAuth();

        $medicine = Medicine::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $medicine->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicine updated successfully',
            'data' => $medicine,
        ]);
    }

    public function destroy($id)
    {
        $this->checkAuth();

        $medicine = Medicine::findOrFail($id);
        $medicine->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medicine deleted successfully',
        ]);
    }
}
