<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyReviewsCaptinRequest;
use App\Http\Requests\StoreReviewsCaptinRequest;
use App\Http\Requests\UpdateReviewsCaptinRequest;
use App\Models\ReviewsCaptin;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewsCaptinController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('reviews_captin_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reviewsCaptins = ReviewsCaptin::with(['captin', 'user'])->get();

        return view('admin.reviewsCaptins.index', compact('reviewsCaptins'));
    }

    public function create()
    {
        abort_if(Gate::denies('reviews_captin_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.reviewsCaptins.create', compact('captins', 'users'));
    }

    public function store(StoreReviewsCaptinRequest $request)
    {
        $reviewsCaptin = ReviewsCaptin::create($request->all());

        return redirect()->route('admin.reviews-captins.index');
    }

    public function edit(ReviewsCaptin $reviewsCaptin)
    {
        abort_if(Gate::denies('reviews_captin_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $reviewsCaptin->load('captin', 'user');

        return view('admin.reviewsCaptins.edit', compact('captins', 'users', 'reviewsCaptin'));
    }

    public function update(UpdateReviewsCaptinRequest $request, ReviewsCaptin $reviewsCaptin)
    {
        $reviewsCaptin->update($request->all());

        return redirect()->route('admin.reviews-captins.index');
    }

    public function show(ReviewsCaptin $reviewsCaptin)
    {
        abort_if(Gate::denies('reviews_captin_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reviewsCaptin->load('captin', 'user');

        return view('admin.reviewsCaptins.show', compact('reviewsCaptin'));
    }

    public function destroy(ReviewsCaptin $reviewsCaptin)
    {
        abort_if(Gate::denies('reviews_captin_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reviewsCaptin->delete();

        return back();
    }

    public function massDestroy(MassDestroyReviewsCaptinRequest $request)
    {
        ReviewsCaptin::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
