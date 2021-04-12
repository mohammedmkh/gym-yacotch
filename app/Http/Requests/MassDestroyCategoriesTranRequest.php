<?php

namespace App\Http\Requests;

use App\Models\CategoriesTran;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

class MassDestroyCategoriesTranRequest extends FormRequest
{
    public function authorize()
    {
        abort_if(Gate::denies('categories_tran_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        return true;
    }

    public function rules()
    {
        return [
            'ids'   => 'required|array',
            'ids.*' => 'exists:categories_trans,id',
        ];
    }
}
