@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.create') }} {{ trans('cruds.category.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.categories.store") }}" enctype="multipart/form-data">
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
                <label for="image">{{ trans('cruds.category.fields.image') }}</label>
                <input class="form-control {{ $errors->has('image') ? 'is-invalid' : '' }}" type="text" name="image" id="image" value="{{ old('image', '') }}">
                @if($errors->has('image'))

                    <div class="fv-plugins-message-container">
                        <div data-field="image" data-validator="notEmpty" class="fv-help-block"> {{ $errors->first('image') }}</div>
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.category.fields.image_helper') }}</span>
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