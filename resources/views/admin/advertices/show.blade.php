@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.advertice.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.advertices.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.advertice.fields.id') }}
                        </th>
                        <td>
                            {{ $advertice->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.advertice.fields.title') }}
                        </th>
                        <td>
                            {{ $advertice->title }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.advertice.fields.image') }}
                        </th>
                        <td>
                            {{ $advertice->image }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.advertice.fields.url') }}
                        </th>
                        <td>
                            {{ $advertice->url }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.advertices.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection