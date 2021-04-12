<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyReportoncaptinRequest;
use App\Http\Requests\StoreReportoncaptinRequest;
use App\Http\Requests\UpdateReportoncaptinRequest;
use App\Models\Course;
use App\Models\Reportoncaptin;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class ReportoncaptinsController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('reportoncaptin_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = Reportoncaptin::with(['captin', 'user', 'course'])->select(sprintf('%s.*', (new Reportoncaptin)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'reportoncaptin_show';
                $editGate      = 'reportoncaptin_edit';
                $deleteGate    = 'reportoncaptin_delete';
                $crudRoutePart = 'reportoncaptins';

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

            $table->addColumn('user_name', function ($row) {
                return $row->user ? $row->user->name : '';
            });

            $table->addColumn('course_name', function ($row) {
                return $row->course ? $row->course->name : '';
            });

            $table->editColumn('text', function ($row) {
                return $row->text ? $row->text : "";
            });

            $table->rawColumns(['actions', 'placeholder', 'captin', 'user', 'course']);

            return $table->make(true);
        }

        return view('admin.reportoncaptins.index');
    }

    public function create()
    {
        abort_if(Gate::denies('reportoncaptin_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $courses = Course::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.reportoncaptins.create', compact('captins', 'users', 'courses'));
    }

    public function store(StoreReportoncaptinRequest $request)
    {
        $reportoncaptin = Reportoncaptin::create($request->all());

        return redirect()->route('admin.reportoncaptins.index');
    }

    public function edit(Reportoncaptin $reportoncaptin)
    {
        abort_if(Gate::denies('reportoncaptin_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $courses = Course::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $reportoncaptin->load('captin', 'user', 'course');

        return view('admin.reportoncaptins.edit', compact('captins', 'users', 'courses', 'reportoncaptin'));
    }

    public function update(UpdateReportoncaptinRequest $request, Reportoncaptin $reportoncaptin)
    {
        $reportoncaptin->update($request->all());

        return redirect()->route('admin.reportoncaptins.index');
    }

    public function show(Reportoncaptin $reportoncaptin)
    {
        abort_if(Gate::denies('reportoncaptin_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reportoncaptin->load('captin', 'user', 'course');

        return view('admin.reportoncaptins.show', compact('reportoncaptin'));
    }

    public function destroy(Reportoncaptin $reportoncaptin)
    {
        abort_if(Gate::denies('reportoncaptin_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reportoncaptin->delete();

        return back();
    }

    public function massDestroy(MassDestroyReportoncaptinRequest $request)
    {
        Reportoncaptin::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
