@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.captin.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.captins.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.id') }}
                        </th>
                        <td>
                            {{ $captin->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.bio') }}
                        </th>
                        <td>
                            {{ $captin->bio }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.image') }}
                        </th>
                        <td>
                            {{ $captin->image }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.cv') }}
                        </th>
                        <td>
                            {{ $captin->cv }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.hours_cost') }}
                        </th>
                        <td>
                            {{ $captin->hours_cost }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.captin.fields.user') }}
                        </th>
                        <td>
                            {{ $captin->user->name ?? '' }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.captins.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection