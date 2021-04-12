@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.traineeCourse.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.trainee-courses.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.id') }}
                        </th>
                        <td>
                            {{ $traineeCourse->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.user') }}
                        </th>
                        <td>
                            {{ $traineeCourse->user->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.course') }}
                        </th>
                        <td>
                            {{ $traineeCourse->course }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.price') }}
                        </th>
                        <td>
                            {{ $traineeCourse->price }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.trainee-courses.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection