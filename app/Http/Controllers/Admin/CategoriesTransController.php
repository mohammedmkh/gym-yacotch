<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyCategoriesTranRequest;
use App\Http\Requests\StoreCategoriesTranRequest;
use App\Http\Requests\UpdateCategoriesTranRequest;
use App\Models\CategoriesTran;
use App\Models\Language;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CategoriesTransController extends Controller
{
    public function index()
    {
        abort_if(Gate::denies('categories_tran_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $categoriesTrans = CategoriesTran::with(['lang'])->get();

        return view('admin.categoriesTrans.index', compact('categoriesTrans'));
    }

    public function create()
    {
        abort_if(Gate::denies('categories_tran_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $langs = Language::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        return view('admin.categoriesTrans.create', compact('langs'));
    }

    public function store(StoreCategoriesTranRequest $request)
    {
        $categoriesTran = CategoriesTran::create($request->all());

        return redirect()->route('admin.categories-trans.index');
    }

    public function edit(CategoriesTran $categoriesTran)
    {
        abort_if(Gate::denies('categories_tran_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $langs = Language::all()->pluck('name', 'id')->prepend(trans('global.pleaseSelect'), '');

        $categoriesTran->load('lang');

        return view('admin.categoriesTrans.edit', compact('langs', 'categoriesTran'));
    }

    public function update(UpdateCategoriesTranRequest $request, CategoriesTran $categoriesTran)
    {
        $categoriesTran->update($request->all());

        return redirect()->route('admin.categories-trans.index');
    }

    public function show(CategoriesTran $categoriesTran)
    {
        abort_if(Gate::denies('categories_tran_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $categoriesTran->load('lang');

        return view('admin.categoriesTrans.show', compact('categoriesTran'));
    }

    public function destroy(CategoriesTran $categoriesTran)
    {
        abort_if(Gate::denies('categories_tran_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $categoriesTran->delete();

        return back();
    }

    public function massDestroy(MassDestroyCategoriesTranRequest $request)
    {
        CategoriesTran::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
