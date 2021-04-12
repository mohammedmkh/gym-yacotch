<?php

namespace App\Http\Requests;

use App\Models\CategoriesTran;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;

class StoreCategoriesTranRequest extends FormRequest
{
    public function authorize()
    {
        return Gate::allows('categories_tran_create');
    }

    public function rules()
    {
        return [
            'name' => [
                'string',
                'nullable',
            ],
        ];
    }
}
