@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.show') }} {{ trans('cruds.reportOntrainee.title') }}
    </div>

    <div class="card-body">
        <div class="form-group">
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.report-ontrainees.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <th>
                            {{ trans('cruds.reportOntrainee.fields.id') }}
                        </th>
                        <td>
                            {{ $reportOntrainee->id }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reportOntrainee.fields.user') }}
                        </th>
                        <td>
                            {{ $reportOntrainee->user->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reportOntrainee.fields.captin') }}
                        </th>
                        <td>
                            {{ $reportOntrainee->captin->name ?? '' }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reportOntrainee.fields.text') }}
                        </th>
                        <td>
                            {{ $reportOntrainee->text }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {{ trans('cruds.reportOntrainee.fields.date') }}
                        </th>
                        <td>
                            {{ $reportOntrainee->date }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="form-group">
                <a class="btn btn-default" href="{{ route('admin.report-ontrainees.index') }}">
                    {{ trans('global.back_to_list') }}
                </a>
            </div>
        </div>
    </div>
</div>



@endsection