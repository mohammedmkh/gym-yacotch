<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyReviewsClinetRequest;
use App\Http\Requests\StoreReviewsClinetRequest;
use App\Http\Requests\UpdateReviewsClinetRequest;
use App\Models\ReviewsClinet;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class ReviewsClinetsController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('reviews_clinet_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = ReviewsClinet::with(['user', 'captin'])->select(sprintf('%s.*', (new ReviewsClinet)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'reviews_clinet_show';
                $editGate      = 'reviews_clinet_edit';
                $deleteGate    = 'reviews_clinet_delete';
                $crudRoutePart = 'reviews-clinets';

                return view('partials.datatablesActions', compact(
                    'viewGate',
                    'editGate',
                    'deleteGate',
                    'crudRoutePart',
                    'row'
                ));
            });

            $table->editColumn('id', function ($row) {
                return $row->id ? $row->id : "";
            });
            $table->addColumn('user_name', function ($row) {
                return $row->user ? $row->user->name : '';
            });

            $table->addColumn('captin_name', function ($row) {
                return $row->captin ? $row->captin->name : '';
            });

            $table->editColumn('review', function ($row) {
                return $row->review ? $row->review : "";
            });
            $table->editColumn('note', function ($row) {
                return $row->note ? $row->note : "";
            });

            $table->rawColumns(['actions', 'placeholder', 'user', 'captin']);

            return $table->make(true);
        }

        return view('admin.reviewsClinets.index');
    }

    public function create()
    {
        abort_if(Gate::denies('reviews_clinet_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.reviewsClinets.create', compact('users', 'captins'));
    }

    public function store(StoreReviewsClinetRequest $request)
    {
        $reviewsClinet = ReviewsClinet::create($request->all());

        return redirect()->route('admin.reviews-clinets.index');
    }

    public function edit(ReviewsClinet $reviewsClinet)
    {
        abort_if(Gate::denies('reviews_clinet_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $reviewsClinet->load('user', 'captin');

        return view('admin.reviewsClinets.edit', compact('users', 'captins', 'reviewsClinet'));
    }

    public function update(UpdateReviewsClinetRequest $request, ReviewsClinet $reviewsClinet)
    {
        $reviewsClinet->update($request->all());

        return redirect()->route('admin.reviews-clinets.index');
    }

    public function show(ReviewsClinet $reviewsClinet)
    {
        abort_if(Gate::denies('reviews_clinet_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reviewsClinet->load('user', 'captin');

        return view('admin.reviewsClinets.show', compact('reviewsClinet'));
    }

    public function destroy(ReviewsClinet $reviewsClinet)
    {
        abort_if(Gate::denies('reviews_clinet_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reviewsClinet->delete();

        return back();
    }

    public function massDestroy(MassDestroyReviewsClinetRequest $request)
    {
        ReviewsClinet::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
