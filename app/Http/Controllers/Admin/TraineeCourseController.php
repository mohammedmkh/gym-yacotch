<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyTraineeCourseRequest;
use App\Http\Requests\StoreTraineeCourseRequest;
use App\Http\Requests\UpdateTraineeCourseRequest;
use App\Models\TraineeCourse;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TraineeCourseController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('trainee_course_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $traineeCourses = TraineeCourse::with(['user'])->get();

        return view('admin.traineeCourses.index', compact('traineeCourses'));
    }

    public function create()
    {
        abort_if(Gate::denies('trainee_course_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.traineeCourses.create', compact('users'));
    }

    public function store(StoreTraineeCourseRequest $request)
    {
        $traineeCourse = TraineeCourse::create($request->all());

        return redirect()->route('admin.trainee-courses.index');
    }

    public function edit(TraineeCourse $traineeCourse)
    {
        abort_if(Gate::denies('trainee_course_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $traineeCourse->load('user');

        return view('admin.traineeCourses.edit', compact('users', 'traineeCourse'));
    }

    public function update(UpdateTraineeCourseRequest $request, TraineeCourse $traineeCourse)
    {
        $traineeCourse->update($request->all());

        return redirect()->route('admin.trainee-courses.index');
    }

    public function show(TraineeCourse $traineeCourse)
    {
        abort_if(Gate::denies('trainee_course_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $traineeCourse->load('user');

        return view('admin.traineeCourses.show', compact('traineeCourse'));
    }

    public function destroy(TraineeCourse $traineeCourse)
    {
        abort_if(Gate::denies('trainee_course_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $traineeCourse->delete();

        return back();
    }

    public function massDestroy(MassDestroyTraineeCourseRequest $request)
    {
        TraineeCourse::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
