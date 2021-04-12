<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyCaptinCertificateRequest;
use App\Http\Requests\StoreCaptinCertificateRequest;
use App\Http\Requests\UpdateCaptinCertificateRequest;
use App\Models\CaptinCertificate;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CaptinCertificateController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('captin_certificate_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captinCertificates = CaptinCertificate::with(['user'])->get();

        return view('admin.captinCertificates.index', compact('captinCertificates'));
    }

    public function create()
    {
        abort_if(Gate::denies('captin_certificate_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.captinCertificates.create', compact('users'));
    }

    public function store(StoreCaptinCertificateRequest $request)
    {
        $captinCertificate = CaptinCertificate::create($request->all());

        return redirect()->route('admin.captin-certificates.index');
    }

    public function edit(CaptinCertificate $captinCertificate)
    {
        abort_if(Gate::denies('captin_certificate_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $captinCertificate->load('user');

        return view('admin.captinCertificates.edit', compact('users', 'captinCertificate'));
    }

    public function update(UpdateCaptinCertificateRequest $request, CaptinCertificate $captinCertificate)
    {
        $captinCertificate->update($request->all());

        return redirect()->route('admin.captin-certificates.index');
    }

    public function show(CaptinCertificate $captinCertificate)
    {
        abort_if(Gate::denies('captin_certificate_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captinCertificate->load('user');

        return view('admin.captinCertificates.show', compact('captinCertificate'));
    }

    public function destroy(CaptinCertificate $captinCertificate)
    {
        abort_if(Gate::denies('captin_certificate_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $captinCertificate->delete();

        return back();
    }

    public function massDestroy(MassDestroyCaptinCertificateRequest $request)
    {
        CaptinCertificate::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
