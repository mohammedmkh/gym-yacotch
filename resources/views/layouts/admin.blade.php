
<!DOCTYPE html>

<html   @if(session()->get('language') != 'en') direction="rtl" dir="rtl" style="direction: rtl" @else lang="en" @endif>
<!--begin::Head-->
<head><base href="">
    <meta charset="utf-8" />
    <title>Metronic Admin</title>
    <meta name="description" content="Updates and statistics" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="canonical" href="https://keenthemes.com/metronic" />
    <!--begin::Fonts-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />
    <!--end::Fonts-->
    <!--begin::Page Vendors Styles(used by this page)-->



    <!--begin::Layout Themes(used by all pages)-->
    <!--end::Layout Themes-->
    <link rel="shortcut icon" href="{{url('assets/media/logos/favicon.ico')}}" />

    @if(session()->get('language') == 'en')

        <link href="{{url('assets/plugins/custom/fullcalendar/fullcalendar.bundle.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/plugins/global/plugins.bundle.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/plugins/custom/prismjs/prismjs.bundle.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/style.bundle.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/plugins/custom/datatables/datatables.bundle.css')}}" rel="stylesheet" type="text/css" />

    @else


        <link href="{{url('assets/plugins/custom/fullcalendar/fullcalendar.bundle.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/plugins/global/plugins.bundle.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/plugins/custom/prismjs/prismjs.bundle.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/style.bundle.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/themes/layout/header/base/light.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/themes/layout/header/menu/light.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/themes/layout/brand/dark.rtl.css')}}" rel="stylesheet" type="text/css" />
        <link href="{{url('assets/css/themes/layout/aside/dark.rtl.css')}}" rel="stylesheet" type="text/css" />


        <link href="https://fonts.googleapis.com/css?family=Cairo&display=swap" rel="stylesheet">
        <style>
            *, h2,h1,h3,h3,p{
                font-family: 'Cairo', sans-serif;
            }

        </style>

    @endif

    @toastr_css
</head>
<!--end::Head-->
<!--begin::Body-->
<body id="kt_body" class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed page-loading">
<!--begin::Main-->
<!--begin::Header Mobile-->
<div id="kt_header_mobile" class="header-mobile align-items-center header-mobile-fixed">
    <!--begin::Logo-->
    <a href="{{url('/')}}">
        <img alt="Logo" class="w-45px" src="{{url('assets/media/logos/logo-letter-13.png')}}" />
    </a>
    <!--end::Logo-->
    <!--begin::Toolbar-->
    <div class="d-flex align-items-center">
        <!--begin::Aside Mobile Toggle-->
        <button class="btn p-0 burger-icon burger-icon-left" id="kt_aside_mobile_toggle">
            <span></span>
        </button>
        <!--end::Aside Mobile Toggle-->
        <!--begin::Header Menu Mobile Toggle-->
        <button class="btn p-0 burger-icon ml-4" id="kt_header_mobile_toggle">
            <span></span>
        </button>
        <!--end::Header Menu Mobile Toggle-->
        <!--begin::Topbar Mobile Toggle-->
        <button class="btn btn-hover-text-primary p-0 ml-2" id="kt_header_mobile_topbar_toggle">
					<span class="svg-icon svg-icon-xl">
						<!--begin::Svg Icon | path:assets/media/svg/icons/General/User.svg-->
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<polygon points="0 0 24 0 24 24 0 24" />
								<path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" />
								<path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero" />
							</g>
						</svg>
                        <!--end::Svg Icon-->
					</span>
        </button>
        <!--end::Topbar Mobile Toggle-->
    </div>
    <!--end::Toolbar-->
</div>
<!--end::Header Mobile-->
<div class="d-flex flex-column flex-root">
    <!--begin::Page-->
    <div class="d-flex flex-row flex-column-fluid page">

        @include('partials.menu')
        <!--begin::Wrapper-->
        <div class="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
            <!--begin::Header-->
        @include('partials.headermenu')
            <!--end::Header-->
            <!--begin::Content-->
            <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
                <!--begin::Subheader-->
                <div class="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
                    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                        <!--begin::Info-->
                        <div class="d-flex align-items-center flex-wrap mr-2">
                            <!--begin::Page Title-->
                            <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Dashboard</h5>
                            <!--end::Page Title-->
                            <!--begin::Actions-->
                            <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
                            <span class="text-muted font-weight-bold mr-4">#XRS-45670</span>
                            <a href="#" class="btn btn-light-warning font-weight-bolder btn-sm">Add New</a>
                            <!--end::Actions-->
                        </div>
                        <!--end::Info-->
                        <!--begin::Toolbar-->

                        <!--end::Toolbar-->
                    </div>
                </div>
                <!--end::Subheader-->





                <div class="container">
                @yield('content')
                </div>






            </div>
            <!--end::Content-->
            <!--begin::Footer-->
            <div class="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
                <!--begin::Container-->
                <div class="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <!--begin::Copyright-->
                    <div class="text-dark order-2 order-md-1">
                        <span class="text-muted font-weight-bold mr-2">2021©</span>
                        <a href="http://keenthemes.com/metronic" target="_blank" class="text-dark-75 text-hover-primary">Keenthemes</a>
                    </div>
                    <!--end::Copyright-->
                    <!--begin::Nav-->
                    <div class="nav nav-dark">
                        <a href="http://keenthemes.com/metronic" target="_blank" class="nav-link pl-0 pr-5">About</a>
                        <a href="http://keenthemes.com/metronic" target="_blank" class="nav-link pl-0 pr-5">Team</a>
                        <a href="http://keenthemes.com/metronic" target="_blank" class="nav-link pl-0 pr-0">Contact</a>
                    </div>
                    <!--end::Nav-->
                </div>
                <!--end::Container-->
            </div>
            <!--end::Footer-->
        </div>
        <!--end::Wrapper-->
    </div>
    <!--end::Page-->
</div>
<!--end::Main-->

<!--end::Demo Panel-->
<script>var HOST_URL = "https://preview.keenthemes.com/metronic/theme/html/tools/preview";</script>
<!--begin::Global Config(global config for global JS scripts)-->
<script>var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1400 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#3699FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#E4E6EF", "dark": "#181C32" }, "light": { "white": "#ffffff", "primary": "#E1F0FF", "secondary": "#EBEDF3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#3F4254", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#EBEDF3", "gray-300": "#E4E6EF", "gray-400": "#D1D3E0", "gray-500": "#B5B5C3", "gray-600": "#7E8299", "gray-700": "#5E6278", "gray-800": "#3F4254", "gray-900": "#181C32" } }, "font-family": "Poppins" };</script>
<!--end::Global Config-->
<!--begin::Global Theme Bundle(used by all pages)-->
<script src="{{url('assets/plugins/global/plugins.bundle.js')}}"></script>
<script src="{{url('assets/plugins/custom/prismjs/prismjs.bundle.js')}}"></script>
<script src="{{url('assets/js/scripts.bundle.js')}}"></script>
<!--end::Global Theme Bundle-->
<!--begin::Page Vendors(used by this page)-->
<script src="{{url('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js')}}"></script>
<!--end::Page Vendors-->
<!--begin::Page Scripts(used by this page)-->
<script src="{{url('assets/js/pages/widgets.js')}}"></script>

<script src="{{url('assets/plugins/custom/datatables/datatables.bundle.js')}}"></script>


<script src="{{url('assets/js/pages/features/miscellaneous/sweetalert2.js')}}"></script>

<script src="{{url('assets/js/pages/crud/forms/widgets/select2.js?v=7.2.6')}}"></script>


<script>






    $(".kt_sweetalert_demo_3_1").click(function(e) {
        Swal.fire("Good job!");
    });



    $(function () {
        let copyButtonTrans = '{{ trans('global.datatables.copy') }}'
        let csvButtonTrans = '{{ trans('global.datatables.csv') }}'
        let excelButtonTrans = '{{ trans('global.datatables.excel') }}'
        let pdfButtonTrans = '{{ trans('global.datatables.pdf') }}'
        let printButtonTrans = '{{ trans('global.datatables.print') }}'
        let colvisButtonTrans = '{{ trans('global.datatables.colvis') }}'
        let selectAllButtonTrans = '{{ trans('global.select_all') }}'
        let selectNoneButtonTrans = '{{ trans('global.deselect_all') }}'

        buttons = [
            {
                extend: 'selectAll',
                className: 'btn-primary',
                text: selectAllButtonTrans,
                exportOptions: {
                    columns: ':visible'
                },
                action: function(e, dt) {
                    e.preventDefault()
                    dt.rows().deselect();
                    dt.rows({ search: 'applied' }).select();
                }
            },
            {
                extend: 'selectNone',
                className: 'btn-primary',
                text: selectNoneButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'copy',
                className: 'btn-default',
                text: copyButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'csv',
                className: 'btn-default',
                text: csvButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                className: 'btn-default',
                text: excelButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'pdfHtml5',
                className: 'btn-default',
                text: pdfButtonTrans,

                exportOptions: {
                    columns: ':visible'
                },
            },
            {
                extend: 'print',
                className: 'btn-default',
                text: printButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'colvis',
                className: 'btn-default',
                text: colvisButtonTrans,
                exportOptions: {
                    columns: ':visible'
                }
            }
        ]


  });



</script>
@yield('scripts')

@toastr_js
@toastr_render
<script type="text/javascript">

    $('#submitButton').click(function(){
        var error = 0;
        var msg = 'An Error Has Occured.\n\nRequired Fields missed are :\n';
        $(':input[required]').each(function(){

            if($(this).attr('type') == 'file'){
                //$(this).attr('placeholder', 'Placeholder text');
                //$(this).close('label').attr('border','19px solid rgb(202, 209, 215)');
            }


            if($(this).val() == ''){
                msg += '\n' + $(this).attr('id') + ' Is A Required Field..';
             //   $(this).css('border','1px solid red');
              //  $(this).addClass('is-invalid');

                if(error == 0){
                    $(this).focus();
                }
                error = 1;
            }
        });


        if(error == 1){
            var id =  $('.tab-pane').find(':required:invalid').closest('.tab-pane').attr('id');
            $('.nav a[href="#' + id + '"]').tab('show');
            return false;
        }
    });


    @if(session()->get('language') == 'en')
    function deleteBtn(){

        var form = $(this).parents('form');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to restore this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {

            form.submit();
        }
    });

    }
    @else
    function deleteBtn(id){

        var form = $('form[name="formdelete'+id+'"]');
        Swal.fire({
            title: 'هل أنت متأكد ؟',
            text: "لا يمكنك استعادة العنصر المحذوف ",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'احذف',
            cancelButtonText: 'الغاء',
        }).then((result) => {
            if (result.value) {

            form.submit();
        }
    });

    }

    @endif





</script>

</body>
<!--end::Body-->
</html>