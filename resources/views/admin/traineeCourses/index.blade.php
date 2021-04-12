@extends('layouts.admin')
@section('content')
@can('trainee_course_create')
    <div style="margin-bottom: 10px;" class="row">
        <div class="col-lg-12">
            <a class="btn btn-success" href="{{ route('admin.trainee-courses.create') }}">
                {{ trans('global.add') }} {{ trans('cruds.traineeCourse.title_singular') }}
            </a>
        </div>
    </div>
@endcan
<div class="card">
    <div class="card-header">
        {{ trans('cruds.traineeCourse.title_singular') }} {{ trans('global.list') }}
    </div>

    <div class="card-body">
        <div class="table-responsive">
            <table class=" table table-bordered table-striped table-hover datatable datatable-TraineeCourse">
                <thead>
                    <tr>
                        <th width="10">

                        </th>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.id') }}
                        </th>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.user') }}
                        </th>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.course') }}
                        </th>
                        <th>
                            {{ trans('cruds.traineeCourse.fields.price') }}
                        </th>
                        <th>
                            &nbsp;
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($traineeCourses as $key => $traineeCourse)
                        <tr data-entry-id="{{ $traineeCourse->id }}">
                            <td>

                            </td>
                            <td>
                                {{ $traineeCourse->id ?? '' }}
                            </td>
                            <td>
                                {{ $traineeCourse->user->name ?? '' }}
                            </td>
                            <td>
                                {{ $traineeCourse->course ?? '' }}
                            </td>
                            <td>
                                {{ $traineeCourse->price ?? '' }}
                            </td>
                            <td>
                                @can('trainee_course_show')
                                    <a class="btn btn-xs btn-primary" href="{{ route('admin.trainee-courses.show', $traineeCourse->id) }}">
                                        {{ trans('global.view') }}
                                    </a>
                                @endcan

                                @can('trainee_course_edit')
                                    <a class="btn btn-xs btn-info" href="{{ route('admin.trainee-courses.edit', $traineeCourse->id) }}">
                                        {{ trans('global.edit') }}
                                    </a>
                                @endcan

                                @can('trainee_course_delete')
                                    <form action="{{ route('admin.trainee-courses.destroy', $traineeCourse->id) }}" method="POST" onsubmit="return confirm('{{ trans('global.areYouSure') }}');" style="display: inline-block;">
                                        <input type="hidden" name="_method" value="DELETE">
                                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                        <input type="submit" class="btn btn-xs btn-danger" value="{{ trans('global.delete') }}">
                                    </form>
                                @endcan

                            </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>



@endsection
@section('scripts')
@parent
<script>
    $(function () {
  let dtButtons = $.extend(true, [], $.fn.dataTable.defaults.buttons)
@can('trainee_course_delete')
  let deleteButtonTrans = '{{ trans('global.datatables.delete') }}'
  let deleteButton = {
    text: deleteButtonTrans,
    url: "{{ route('admin.trainee-courses.massDestroy') }}",
    className: 'btn-danger',
    action: function (e, dt, node, config) {
      var ids = $.map(dt.rows({ selected: true }).nodes(), function (entry) {
          return $(entry).data('entry-id')
      });

      if (ids.length === 0) {
        alert('{{ trans('global.datatables.zero_selected') }}')

        return
      }

      if (confirm('{{ trans('global.areYouSure') }}')) {
        $.ajax({
          headers: {'x-csrf-token': _token},
          method: 'POST',
          url: config.url,
          data: { ids: ids, _method: 'DELETE' }})
          .done(function () { location.reload() })
      }
    }
  }
  dtButtons.push(deleteButton)
@endcan

  $.extend(true, $.fn.dataTable.defaults, {
    orderCellsTop: true,
    order: [[ 1, 'desc' ]],
    pageLength: 100,
  });
  let table = $('.datatable-TraineeCourse:not(.ajaxTable)').DataTable({ buttons: dtButtons })
  $('a[data-toggle="tab"]').on('shown.bs.tab click', function(e){
      $($.fn.dataTable.tables(true)).DataTable()
          .columns.adjust();
  });
  
})

</script>
@endsection