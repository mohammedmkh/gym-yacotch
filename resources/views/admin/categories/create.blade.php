@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.category.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.categories.store") }}" enctype="multipart/form-data">
            @csrf


            @if ($errors->has('image'))
                <div class="alert alert-custom alert-outline-2x alert-outline-danger fade show mb-5" role="alert">
                    <div class="alert-icon">
                        <i class="flaticon-warning"></i>
                    </div>
                    <div class="alert-text">{{$errors->first('image')}}</div>
                    <div class="alert-close">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
																	<span aria-hidden="true">
																		<i class="ki ki-close"></i>
																	</span>
                        </button>
                    </div>
                </div>
            @endif

            <div class="row">
                <div class="col-3" >
                    <ul class="nav nav-tabs nav-tabs-line tabs-left sideways">
                        @foreach($languages as $lang)

                            <li class="nav-item"><a href="#language-{{$lang->id}}" class="nav-link  {{ $loop->index == 0 ? 'active' : '' }} " data-toggle="tab">  {{$lang->name}} </a></li>
                        @endforeach
                    </ul>
                </div>
                <div class="col-7">
                    <div class="tab-content mt-5">

                        @foreach($languages as $lang)
                            <div class="tab-pane fade {{ $loop->index == 0 ? 'active show' : '' }}" id="language-{{$lang->id}}">


                                <div class="form-group{{ $errors->has('name.*') ? ' has-danger' : '' }}">

                                    <label class="form-control-label" for="input-name">{{ __('Name') }}</label>
                                    <input type="text" name="name[{{$lang->id}}]" id="input-name" class="form-control form-control-alternative{{ $errors->has('name') ? ' is-invalid' : '' }}" placeholder="{{ __('Name') }}" value="{{ old('name.'.$lang->id) }}" required autofocus>
                                    @if ($errors->has('name.'.$lang->id))

                                        <div class="fv-plugins-message-container">
                                            <div data-field="name" data-validator="notEmpty" class="fv-help-block">{{ $errors->first('name.'.$lang->id) }}</div>
                                        </div>

                                    @endif
                                </div>



                            </div>

                        @endforeach





                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="image-input image-input-outline" id="kt_image_1">
                    <div class="image-input-wrapper" style="background-image: url({{url('assets/media/image_large.png')}})"></div>
                    <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" data-toggle="tooltip" title="" data-original-title="Change avatar">
                        <i class="fa fa-pen icon-sm text-muted"></i>
                        <input type="file" name="image" accept=".png, .jpg, .jpeg" />
                        <input type="hidden" name="image_remove" />
                    </label>
                    <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
															<i class="ki ki-bold-close icon-xs text-muted"></i>
														</span>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-danger" type="submit" id="submitButton">
                    {{ trans('global.save') }}
                </button>
            </div>
        </form>
    </div>
</div>



@endsection


@section('scripts')
    <script src="{{url('assets/js/pages/crud/file-upload/image-input.js')}}"></script>
    <script>



        $('#submitButton').click(function(){
            var error = 0;
            var msg = 'An Error Has Occured.\n\nRequired Fields missed are :\n';
            $(':input[required]').each(function(){
                $(this).addClass('is-invalid');
                if($(this).attr('type') == 'file'){
                    $(this).attr('placeholder', 'Placeholder text');
                    $(this).close('label').attr('border','19px solid rgb(202, 209, 215)');
                }


                if($(this).val() == ''){
                    msg += '\n' + $(this).attr('id') + ' Is A Required Field..';
                    $(this).css('border','1px solid red');
                    if(error == 0){
                        $(this).focus();
                    }
                    error = 1;
                }
            });


            if(error == 1){
                var id =  $('.tab-pane').find(':required:invalid').closest('.tab-pane').attr('id');

                // Find the link that corresponds to the pane and have it show
                console.log('the id is' + id);
                $('.nav a[href="#' + id + '"]').tab('show');

                // Only want to do it once
                return false;
            }
        });

    </script>

@endsection