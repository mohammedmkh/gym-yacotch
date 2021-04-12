<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyCaptinRequest;
use App\Http\Requests\StoreCaptinRequest;
use App\Http\Requests\UpdateCaptinRequest;
use App\Models\Captin;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CaptinsController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('captin_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captins = Captin::with(['user'])->get();

        return view('admin.captins.index', compact('captins'));
    }

    public function create()
    {
        abort_if(Gate::denies('captin_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.captins.create', compact('users'));
    }

    public function store(StoreCaptinRequest $request)
    {
        $captin = Captin::create($request->all());

        return redirect()->route('admin.captins.index');
    }

    public function edit(Captin $captin)
    {
        abort_if(Gate::denies('captin_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captin->load('user');

        return view('admin.captins.edit', compact('users', 'captin'));
    }

    public function update(UpdateCaptinRequest $request, Captin $captin)
    {
        $captin->update($request->all());

        return redirect()->route('admin.captins.index');
    }

    public function show(Captin $captin)
    {
        abort_if(Gate::denies('captin_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captin->load('user');

        return view('admin.captins.show', compact('captin'));
    }

    public function destroy(Captin $captin)
    {
        abort_if(Gate::denies('captin_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captin->delete();

        return back();
    }

    public function massDestroy(MassDestroyCaptinRequest $request)
    {
        Captin::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
