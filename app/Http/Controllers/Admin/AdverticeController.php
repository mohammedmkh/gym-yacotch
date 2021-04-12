<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyAdverticeRequest;
use App\Http\Requests\StoreAdverticeRequest;
use App\Http\Requests\UpdateAdverticeRequest;
use App\Models\Advertice;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class AdverticeController extends Controller
{
    public function index(Request $request)
    {
        abort_if(Gate::denies('advertice_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = Advertice::query()->select(sprintf('%s.*', (new Advertice)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'advertice_show';
                $editGate      = 'advertice_edit';
                $deleteGate    = 'advertice_delete';
                $crudRoutePart = 'advertices';

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
            $table->editColumn('title', function ($row) {
                return $row->title ? $row->title : "";
            });
            $table->editColumn('image', function ($row) {
                return $row->image ? $row->image : "";
            });
            $table->editColumn('url', function ($row) {
                return $row->url ? $row->url : "";
            });

            $table->rawColumns(['actions', 'placeholder']);

            return $table->make(true);
        }

        return view('admin.advertices.index');
    }

    public function create()
    {
        abort_if(Gate::denies('advertice_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.advertices.create');
    }

    public function store(StoreAdverticeRequest $request)
    {
        $advertice = Advertice::create($request->all());

        return redirect()->route('admin.advertices.index');
    }

    public function edit(Advertice $advertice)
    {
        abort_if(Gate::denies('advertice_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.advertices.edit', compact('advertice'));
    }

    public function update(UpdateAdverticeRequest $request, Advertice $advertice)
    {
        $advertice->update($request->all());

        return redirect()->route('admin.advertices.index');
    }

    public function show(Advertice $advertice)
    {
        abort_if(Gate::denies('advertice_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.advertices.show', compact('advertice'));
    }

    public function destroy(Advertice $advertice)
    {
        abort_if(Gate::denies('advertice_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $advertice->delete();

        return back();
    }

    public function massDestroy(MassDestroyAdverticeRequest $request)
    {
        Advertice::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
