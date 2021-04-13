<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MassDestroyCategoryRequest;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Translation;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;
use \Validator;

class CategoriesController extends Controller
{
    public function index(Request $request)
    {

        abort_if(Gate::denies('category_access'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        if ($request->ajax()) {
            $query = Category::query()->select(sprintf('%s.*', (new Category)->table));
            $table = Datatables::of($query);

            $table->addColumn('placeholder', '&nbsp;');
            $table->addColumn('actions', '&nbsp;');

            $table->editColumn('actions', function ($row) {
                $viewGate      = 'category_show';
                $editGate      = 'category_edit';
                $deleteGate    = 'category_delete';
                $crudRoutePart = 'categories';

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
            $table->addColumn('name', function ($row) {
                return $row->name ? $row->name : "";
            });
            $table->editColumn('image', function ($row) {
                return  "<img src='".$row->image_url."' height='100'>";
            });

            $table->rawColumns(['actions', 'placeholder' ,'image']);

            return $table->make(true);
        }

        return view('admin.categories.index');
    }

    public function create()
    {
        abort_if(Gate::denies('category_create'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.categories.create');
    }

    public function store(Request $request)
    {

        $data = $request->all();

        $validator = Validator::make($request->all(),
            [
                'name.*' => 'bail|required',
                'image' => 'bail|required' ,
            ]
        );
        $validator->validate();


        if ($request->hasFile('image')) {

            $validator = Validator::make($request->all(),
                [
                    'image' => 'max:2000',
                ]
            );
            $validator->validate();

            $image = $request->file('image');
            $name_image =  uploadFile($image );
            $data['image'] =  $name_image;

        }


        $category = new Category();
        $category->image = $data['image'] ;
        $category->save();


       foreach ($request->name as $key=>$name){
           $trans = new Translation();
           $d['name'] = $name ;
           $trans->values = json_encode(   $d );
           $trans->lang_id = $key;
           $trans->save();
           $category->translation()->save($trans);
       }



        return redirect()->route('admin.categories.index');
    }

    public function edit(Category $category)
    {
        abort_if(Gate::denies('category_edit'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.categories.edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {

        if ($request->hasFile('image')) {

            $validator = Validator::make($request->all(),
                [
                    'image' => 'max:2000',
                ]
            );
            $validator->validate();

            $image = $request->file('image');
            $name_image =  uploadFile($image );
            //delete old image from category
            if($name_image != ''){
                removeFile($category->image);
                $category->update(['image' =>  $name_image ]);
            }


        }

         $category->translation()->delete();


        foreach ($request->name as $key=>$name){
            $trans = new Translation();
            $d['name'] = $name ;
            $trans->values = json_encode(   $d );
            $trans->lang_id = $key;
            $trans->save();
            $category->translation()->save($trans);
        }





        return redirect()->route('admin.categories.index');
    }

    public function show(Category $category)
    {
        abort_if(Gate::denies('category_show'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return view('admin.categories.show', compact('category'));
    }

    public function destroy(Category $category)
    {
        abort_if(Gate::denies('category_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');
        removeFile($category->image);
        $category->delete();

        return back();
    }

    public function massDestroy(MassDestroyCategoryRequest $request)
    {
        Category::whereIn('id', request('ids'))->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }
}
