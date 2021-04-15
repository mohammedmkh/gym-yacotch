@extends('layouts.admin')
@section('content')
@can('translation_create')
    <div style="margin-bottom: 10px;" class="row">
        <div class="col-lg-12">
            <a class="btn btn-success" href="{{ route('admin.translations.create') }}">
                {{ trans('global.add') }} {{ trans('cruds.translation.title_singular') }}
            </a>
        </div>
    </div>
@endcan
<div class="card">
    <div class="card-header">
        {{ trans('cruds.translation.title_singular') }} {{ trans('global.list') }}
    </div>

    <div class="card-body">
        <div class="table-responsive">
            <table class=" table table-bordered table-striped table-hover datatable datatable-Translation">
                <thead>
                    <tr>
                        <th width="10">

                        </th>
                        <th>
                            {{ trans('cruds.translation.fields.id') }}
                        </th>
                        <th>
                            {{ trans('cruds.translation.fields.lang') }}
                        </th>
                        <th>
                            {{ trans('cruds.translation.fields.transtable_type') }}
                        </th>
                        <th>
                            {{ trans('cruds.translation.fields.transtable_id') }}
                        </th>
                        <th>
                            {{ trans('cruds.translation.fields.values') }}
                        </th>
                        <th>
                            &nbsp;
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($translations as $key => $translation)
                        <tr data-entry-id="{{ $translation->id }}">
                            <td>

                            </td>
                            <td>
                                {{ $translation->id ?? '' }}
                            </td>
                            <td>
                                {{ $translation->lang->name ?? '' }}
                            </td>
                            <td>
                                {{ $translation->transtable_type ?? '' }}
                            </td>
                            <td>
                                {{ $translation->transtable_id ?? '' }}
                            </td>
                            <td>
                                {{ $translation->values ?? '' }}
                            </td>
                            <td>
                                @can('translation_show')
                                    <a class="btn btn-xs btn-primary" href="{{ route('admin.translations.show', $translation->id) }}">
                                        {{ trans('global.view') }}
                                    </a>
                                @endcan

                                @can('translation_edit')
                                    <a class="btn btn-xs btn-info" href="{{ route('admin.translations.edit', $translation->id) }}">
                                        {{ trans('global.edit') }}
                                    </a>
                                @endcan

                                @can('translation_delete')
                                    <form action="{{ route('admin.translations.destroy', $translation->id) }}" method="POST" onsubmit="return confirm('{{ trans('global.areYouSure') }}');" style="display: inline-block;">
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
@can('translation_delete')
  let deleteButtonTrans = '{{ trans('global.datatables.delete') }}'
  let deleteButton = {
    text: deleteButtonTrans,
    url: "{{ route('admin.translations.massDestroy') }}",
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
  let table = $('.datatable-Translation:not(.ajaxTable)').DataTable({ buttons: dtButtons })
  $('a[data-toggle="tab"]').on('shown.bs.tab click', function(e){
      $($.fn.dataTable.tables(true)).DataTable()
          .columns.adjust();
  });

})

</script>
@endsection
