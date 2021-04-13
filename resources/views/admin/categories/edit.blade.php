@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.category.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.categories.update", [$category->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf


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
                                    <input type="text" name="name[{{$lang->id}}]" id="input-name" class="form-control form-control-alternative{{ $errors->has('name') ? ' is-invalid' : '' }}" placeholder="{{ __('Name') }}" value="{{ old('name.'.$lang->id , $category->getNameLang($lang->id)) }}" required autofocus>
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
                <div class="form-group">
                    <div class="image-input image-input-outline" id="kt_image_1">
                        <div class="image-input-wrapper" style="background-image: url({{$category->image_url}})"></div>
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
            </div>
            <div class="form-group">
                <button class="btn btn-danger" type="submit">
                    {{ trans('global.save') }}
                </button>
            </div>
        </form>
    </div>
</div>



@endsection

@section('scripts')
    <script src="{{url('assets/js/pages/crud/file-upload/image-input.js')}}"></script>
@endsection