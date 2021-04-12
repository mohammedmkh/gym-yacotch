<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyReportOntraineeRequest;
use App\Http\Requests\StoreReportOntraineeRequest;
use App\Http\Requests\UpdateReportOntraineeRequest;
use App\Models\ReportOntrainee;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class ReportOntraineeController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('report_ontrainee_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = ReportOntrainee::with(['user', 'captin'])->select(sprintf('%s.*', (new ReportOntrainee)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'report_ontrainee_show';
                $editGate      = 'report_ontrainee_edit';
                $deleteGate    = 'report_ontrainee_delete';
                $crudRoutePart = 'report-ontrainees';

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

            $table->editColumn('text', function ($row) {
                return $row->text ? $row->text : "";
            });

            $table->rawColumns(['actions', 'placeholder', 'user', 'captin']);

            return $table->make(true);
        }

        return view('admin.reportOntrainees.index');
    }

    public function create()
    {
        abort_if(Gate::denies('report_ontrainee_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.reportOntrainees.create', compact('users', 'captins'));
    }

    public function store(StoreReportOntraineeRequest $request)
    {
        $reportOntrainee = ReportOntrainee::create($request->all());

        return redirect()->route('admin.report-ontrainees.index');
    }

    public function edit(ReportOntrainee $reportOntrainee)
    {
        abort_if(Gate::denies('report_ontrainee_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captins = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $reportOntrainee->load('user', 'captin');

        return view('admin.reportOntrainees.edit', compact('users', 'captins', 'reportOntrainee'));
    }

    public function update(UpdateReportOntraineeRequest $request, ReportOntrainee $reportOntrainee)
    {
        $reportOntrainee->update($request->all());

        return redirect()->route('admin.report-ontrainees.index');
    }

    public function show(ReportOntrainee $reportOntrainee)
    {
        abort_if(Gate::denies('report_ontrainee_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reportOntrainee->load('user', 'captin');

        return view('admin.reportOntrainees.show', compact('reportOntrainee'));
    }

    public function destroy(ReportOntrainee $reportOntrainee)
    {
        abort_if(Gate::denies('report_ontrainee_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $reportOntrainee->delete();

        return back();
    }

    public function massDestroy(MassDestroyReportOntraineeRequest $request)
    {
        ReportOntrainee::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
