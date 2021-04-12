<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyTraineeInforamationRequest;
use App\Http\Requests\StoreTraineeInforamationRequest;
use App\Http\Requests\UpdateTraineeInforamationRequest;
use App\Models\TraineeInforamation;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class TraineeInforamationController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('trainee_inforamation_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = TraineeInforamation::with(['user'])->select(sprintf('%s.*', (new TraineeInforamation)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'trainee_inforamation_show';
                $editGate      = 'trainee_inforamation_edit';
                $deleteGate    = 'trainee_inforamation_delete';
                $crudRoutePart = 'trainee-inforamations';

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

            $table->editColumn('weight', function ($row) {
                return $row->weight ? $row->weight : "";
            });
            $table->editColumn('tall', function ($row) {
                return $row->tall ? $row->tall : "";
            });
            $table->editColumn('age', function ($row) {
                return $row->age ? $row->age : "";
            });
            $table->editColumn('reminder_time', function ($row) {
                return $row->reminder_time ? $row->reminder_time : "";
            });

            $table->rawColumns(['actions', 'placeholder', 'user']);

            return $table->make(true);
        }

        return view('admin.traineeInforamations.index');
    }

    public function create()
    {
        abort_if(Gate::denies('trainee_inforamation_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.traineeInforamations.create', compact('users'));
    }

    public function store(StoreTraineeInforamationRequest $request)
    {
        $traineeInforamation = TraineeInforamation::create($request->all());

        return redirect()->route('admin.trainee-inforamations.index');
    }

    public function edit(TraineeInforamation $traineeInforamation)
    {
        abort_if(Gate::denies('trainee_inforamation_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $traineeInforamation->load('user');

        return view('admin.traineeInforamations.edit', compact('users', 'traineeInforamation'));
    }

    public function update(UpdateTraineeInforamationRequest $request, TraineeInforamation $traineeInforamation)
    {
        $traineeInforamation->update($request->all());

        return redirect()->route('admin.trainee-inforamations.index');
    }

    public function show(TraineeInforamation $traineeInforamation)
    {
        abort_if(Gate::denies('trainee_inforamation_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $traineeInforamation->load('user');

        return view('admin.traineeInforamations.show', compact('traineeInforamation'));
    }

    public function destroy(TraineeInforamation $traineeInforamation)
    {
        abort_if(Gate::denies('trainee_inforamation_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $traineeInforamation->delete();

        return back();
    }

    public function massDestroy(MassDestroyTraineeInforamationRequest $request)
    {
        TraineeInforamation::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
