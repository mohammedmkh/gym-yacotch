@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.reviewsClinet.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.reviews-clinets.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsClinet.fields.id') }}
                        </th>
                        <td>
                            {{ $reviewsClinet->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsClinet.fields.user') }}
                        </th>
                        <td>
                            {{ $reviewsClinet->user->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsClinet.fields.captin') }}
                        </th>
                        <td>
                            {{ $reviewsClinet->captin->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsClinet.fields.review') }}
                        </th>
                        <td>
                            {{ $reviewsClinet->review }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reviewsClinet.fields.note') }}
                        </th>
                        <td>
                            {{ $reviewsClinet->note }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.reviews-clinets.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection