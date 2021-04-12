<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyCourseRequest;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use App\Models\Plan;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class CoursesController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('course_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = Course::with(['captin', 'plan', 'trainee'])->select(sprintf('%s.*', (new Course)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'course_show';
                $editGate      = 'course_edit';
                $deleteGate    = 'course_delete';
                $crudRoutePart = 'courses';

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
            $table->addColumn('captin_name', function ($row) {
                return $row->captin ? $row->captin->name : '';
            });

            $table->editColumn('name', function ($row) {
                return $row->name ? $row->name : "";
            });
            $table->addColumn('plan_name', function ($row) {
                return $row->plan ? $row->plan->name : '';
            });

            $table->editColumn('hours', function ($row) {
                return $row->hours ? $row->hours : "";
            });
            $table->editColumn('price', function ($row) {
                return $row->price ? $row->price : "";
            });
            $table->editColumn('discount', function ($row) {
                return $row->discount ? $row->discount : "";
            });
            $table->editColumn('type_course', function ($row) {
                return $row->type_course ? $row->type_course : "";
            });
            $table->addColumn('trainee_name', function ($row) {
                return $row->trainee ? $row->trainee->name : '';
            });

            $table->rawColumns(['actions', 'placeholder', 'captin', 'plan', 'trainee']);

            return $table->make(true);
        }

        return view('admin.courses.index');
    }

    public function create()
    {
        abort_if(Gate::denies('course_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $plans = Plan::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $trainees = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.courses.create', compact('captins', 'plans', 'trainees'));
    }

    public function store(StoreCourseRequest $request)
    {
        $course = Course::create($request->all());

        return redirect()->route('admin.courses.index');
    }

    public function edit(Course $course)
    {
        abort_if(Gate::denies('course_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $plans = Plan::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $trainees = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $course->load('captin', 'plan', 'trainee');

        return view('admin.courses.edit', compact('captins', 'plans', 'trainees', 'course'));
    }

    public function update(UpdateCourseRequest $request, Course $course)
    {
        $course->update($request->all());

        return redirect()->route('admin.courses.index');
    }

    public function show(Course $course)
    {
        abort_if(Gate::denies('course_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $course->load('captin', 'plan', 'trainee');

        return view('admin.courses.show', compact('course'));
    }

    public function destroy(Course $course)
    {
        abort_if(Gate::denies('course_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $course->delete();

        return back();
    }

    public function massDestroy(MassDestroyCourseRequest $request)
    {
        Course::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
