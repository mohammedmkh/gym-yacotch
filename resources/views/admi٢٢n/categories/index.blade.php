@extends('layouts.admin')
@section('content')


        <!--begin::Notice-->
        <!--end::Notice-->
        <!--begin::Card-->
        <div class="card card-custom">
            <div class="card-header flex-wrap border-0 pt-6 pb-0">
                <div class="card-title">
                    <h3 class="card-label"> {{ trans('cruds.category.title_singular') }}
                        <span class="d-block text-muted pt-2 font-size-sm">{{ trans('global.list') }}</span></h3>
                </div>
                <div class="card-toolbar">

                    <!--begin::Button-->
                    @can('category_create')
                                  <a href="{{ route('admin.categories.create') }}" class="btn btn-primary font-weight-bolder">
											<span class="svg-icon svg-icon-md">
												<!--begin::Svg Icon | path:assets/media/svg/icons/Design/Flatten.svg-->
												<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
													<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
														<rect x="0" y="0" width="24" height="24" />
														<circle fill="#000000" cx="9" cy="15" r="6" />
														<path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3" />
													</g>
												</svg>
                                                <!--end::Svg Icon-->
											</span>New {{ trans('cruds.category.title_singular') }}</a>
                    @endif
                    <!--end::Button-->
                </div>
            </div>
            <div class="card-body">
                <!--begin: Search Form-->
                <!--begin::Search Form-->
                <div class="mb-7">
                    <div class="row align-items-center">
                        <div class="col-lg-9 col-xl-8">
                            <div class="row align-items-center">
                                <div class="col-md-4 my-2 my-md-0">
                                    <div class="input-icon">
                                        <input type="text" class="form-control" placeholder="Search..." id="search_query_name" />
                                        <span>
																	<i class="flaticon2-search-1 text-muted"></i>
																</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-lg-3 col-xl-4 mt-5 mt-lg-0">
                            <a href="#" class="btn btn-light-primary px-6 font-weight-bold">Search</a>
                        </div>
                    </div>
                </div>
                <!--end::Search Form-->
                <!--end: Search Form-->
                <!--begin: Datatable-->

                    <table class=" table table-bordered table-striped table-hover ajaxTable datatable datatable-Category">
                        <thead>
                        <tr>
                            <th width="10">

                            </th>
                            <th>
                                {{ trans('cruds.category.fields.id') }}
                            </th>
                            <th>
                                {{ trans('cruds.category.fields.name') }}
                            </th>
                            <th>
                                {{ trans('cruds.category.fields.image') }}
                            </th>
                            <th>
                                &nbsp;{{ trans('global.actions') }}
                            </th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <!--end: Datatable-->
            </div>

        <!--end::Card-->


        <style>
            #processingloading{
                position:absolute;
                top:0;
                left:0;
                right:0;
                bottom:0;
                margin:auto;
                height: 70px;
                width: 70px;
            }
            .dataTables_processing {
                position: inherit!important;
                top: 50%;
                left: 50%;
                width: 70px!important;;
                height: 70px!important;;

                background-color: transparent!important;

            }
        </style>

@endsection
@section('scripts')
@parent
<script>
    $(function () {


        let dtOverrideGlobals = {
                 dom: 'Bfrtip',
                buttons:buttons,
                processing: true,
                language: {
                    processing: "<img src='{{url('loading.gif')}}' id='processingloading'>",
                },
                serverSide: true,
                retrieve: true,
                aaSorting: [],
                ajax: "{{ route('admin.categories.index') }}",
                columns: [
                    { data: 'placeholder', name: 'placeholder' },
                    { data: 'id', name: 'id' },
                    { data: 'name', name: 'name' },
                    { data: 'image', name: 'image' },
                    { data: 'actions', name: '{{ trans('global.actions') }}' }
                ],
                orderCellsTop: true,
                order: [[ 1, 'desc' ]],
                pageLength: 100,
            };
        var table = $('.datatable-Category').DataTable(dtOverrideGlobals);
        $('a[data-toggle="tab"]').on('shown.bs.tab click', function(e){
            $($.fn.dataTable.tables(true)).DataTable()
                .columns.adjust();
        });



    });

</script>


@endsection