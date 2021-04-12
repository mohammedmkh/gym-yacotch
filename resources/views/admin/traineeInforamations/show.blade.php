@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.traineeInforamation.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.trainee-inforamations.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.id') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.user') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->user->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.weight') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->weight }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.tall') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->tall }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.age') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->age }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeInforamation.fields.reminder_time') }}
                        </th>
                        <td>
                            {{ $traineeInforamation->reminder_time }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.trainee-inforamations.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection