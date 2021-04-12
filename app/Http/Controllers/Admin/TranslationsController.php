<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyTranslationRequest;
use App\Http\Requests\StoreTranslationRequest;
use App\Http\Requests\UpdateTranslationRequest;
use App\Models\Language;
use App\Models\Translation;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TranslationsController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('translation_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $translations = Translation::with(['lang'])->get();

        return view('admin.translations.index', compact('translations'));
    }

    public function create()
    {
        abort_if(Gate::denies('translation_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $langs = Language::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.translations.create', compact('langs'));
    }

    public function store(StoreTranslationRequest $request)
    {
        $translation = Translation::create($request->all());

        return redirect()->route('admin.translations.index');
    }

    public function edit(Translation $translation)
    {
        abort_if(Gate::denies('translation_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $langs = Language::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $translation->load('lang');

        return view('admin.translations.edit', compact('langs', 'translation'));
    }

    public function update(UpdateTranslationRequest $request, Translation $translation)
    {
        $translation->update($request->all());

        return redirect()->route('admin.translations.index');
    }

    public function show(Translation $translation)
    {
        abort_if(Gate::denies('translation_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $translation->load('lang');

        return view('admin.translations.show', compact('translation'));
    }

    public function destroy(Translation $translation)
    {
        abort_if(Gate::denies('translation_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $translation->delete();

        return back();
    }

    public function massDestroy(MassDestroyTranslationRequest $request)
    {
        Translation::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
