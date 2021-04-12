<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyImageRequest;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\Image;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ImagesController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('image_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $images = Image::with(['user'])->get();

        return view('admin.images.index', compact('images'));
    }

    public function create()
    {
        abort_if(Gate::denies('image_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.images.create', compact('users'));
    }

    public function store(StoreImageRequest $request)
    {
        $image = Image::create($request->all());

        return redirect()->route('admin.images.index');
    }

    public function edit(Image $image)
    {
        abort_if(Gate::denies('image_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $users = User::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $image->load('user');

        return view('admin.images.edit', compact('users', 'image'));
    }

    public function update(UpdateImageRequest $request, Image $image)
    {
        $image->update($request->all());

        return redirect()->route('admin.images.index');
    }

    public function show(Image $image)
    {
        abort_if(Gate::denies('image_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $image->load('user');

        return view('admin.images.show', compact('image'));
    }

    public function destroy(Image $image)
    {
        abort_if(Gate::denies('image_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $image->delete();

        return back();
    }

    public function massDestroy(MassDestroyImageRequest $request)
    {
        Image::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
