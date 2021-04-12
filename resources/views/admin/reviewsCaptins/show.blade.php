@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.reviewsCaptin.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.reviews-captins.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsCaptin.fields.id') }}
                        </th>
                        <td>
                            {{ $reviewsCaptin->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsCaptin.fields.captin') }}
                        </th>
                        <td>
                            {{ $reviewsCaptin->captin->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsCaptin.fields.user') }}
                        </th>
                        <td>
                            {{ $reviewsCaptin->user->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsCaptin.fields.review') }}
                        </th>
                        <td>
                            {{ $reviewsCaptin->review }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsCaptin.fields.note') }}
                        </th>
                        <td>
                            {{ $reviewsCaptin->note }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.reviews-captins.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection