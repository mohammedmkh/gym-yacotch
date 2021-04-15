@extends('layouts.admin')
@section('content')

<div class="card">
    <div class="card-header">
        {{ trans('global.edit') }} {{ trans('cruds.user.title_singular') }}
    </div>

    <div class="card-body">
        <form method="POST" action="{{ route("admin.users.update", [$user->id]) }}" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="form-group">
                <label class="required" for="name">{{ trans('cruds.user.fields.name') }}</label>
                <input class="form-control {{ $errors->has('name') ? 'is-invalid' : '' }}" type="text" name="name" id="name" value="{{ old('name', $user->name) }}" required>
                @if($errors->has('name'))
                    <div class="invalid-feedback">
                        {{ $errors->first('name') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.name_helper') }}</span>
            </div>
            <div class="form-group">
                <label class="required" for="email">{{ trans('cruds.user.fields.email') }}</label>
                <input class="form-control {{ $errors->has('email') ? 'is-invalid' : '' }}" type="email" name="email" id="email" value="{{ old('email', $user->email) }}" required>
                @if($errors->has('email'))
                    <div class="invalid-feedback">
                        {{ $errors->first('email') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.email_helper') }}</span>
            </div>
            <div class="form-group">
                <label class="required" for="password">{{ trans('cruds.user.fields.password') }}</label>
                <input class="form-control {{ $errors->has('password') ? 'is-invalid' : '' }}" type="password" name="password" id="password">
                @if($errors->has('password'))
                    <div class="invalid-feedback">
                        {{ $errors->first('password') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.password_helper') }}</span>
            </div>
            <div class="form-group">
                <label class="required" for="roles">{{ trans('cruds.user.fields.roles') }}</label>
                {{--    <div style="padding-bottom: 4px">
                        <span class="btn btn-info btn-xs select-all" style="border-radius: 0">{{ trans('global.select_all') }}</span>
                        <span class="btn btn-info btn-xs deselect-all" style="border-radius: 0">{{ trans('global.deselect_all') }}</span>
                    </div>--}}
                <select class="form-control  {{ $errors->has('roles') ? 'is-invalid' : '' }}" name="roles[]" id="roles"  required>
                    @foreach($roles as $id => $roles)
                        <option value="{{ $id }}" {{ (in_array($id, old('roles', [])) || $user->roles->contains($id)) ? 'selected' : '' }}>{{ $roles }}</option>
                    @endforeach
                </select>
                @if($errors->has('roles'))
                    <div class="invalid-feedback">
                        {{ $errors->first('roles') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.roles_helper') }}</span>
            </div>
            <div class="form-group">
                <label class="required" for="roles">{{ trans('cruds.user.fields.category') }}</label>
                {{--    <div style="padding-bottom: 4px">
                        <span class="btn btn-info btn-xs select-all" style="border-radius: 0">{{ trans('global.select_all') }}</span>
                        <span class="btn btn-info btn-xs deselect-all" style="border-radius: 0">{{ trans('global.deselect_all') }}</span>
                    </div>--}}
                <select  class="form-control select2   {{ $errors->has('categories') ? 'is-invalid' : '' }}" data-placeholder="categories" name="category_id" id=""  required>
                    <option value=""></option>
                    @foreach($categories as $id => $category)

                        <option value="{{ $id }}" {{ (in_array($id, old('categories', [])) || $user->categories->id) ? 'selected' : '' }}>{{ $user->categories->name }}</option>
                    @endforeach
                </select>
                @if($errors->has('roles'))
                    <div class="invalid-feedback">
                        {{ $errors->first('roles') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.roles_helper') }}</span>
            </div>

            <div class="form-group">
                <label class="required" for="roles">{{ trans('cruds.user.fields.plans') }}</label>
                {{--           <div style="padding-bottom: 4px">
                               <span class="btn btn-info btn-xs select-all" style="border-radius: 0">{{ trans('global.select_all') }}</span>
                               <span class="btn btn-info btn-xs deselect-all" style="border-radius: 0">{{ trans('global.deselect_all') }}</span>
                           </div>--}}
                <select data-placeholder="Plans" class="form-control select2 {{ $errors->has('plans') ? 'is-invalid' : '' }}" name="plans[]" id="plans"  required>
                    <option value=""></option>

                @foreach($plans as $id => $plans)
                        <option value="{{ $id }}" {{ (in_array($id, old('plans', [])) || $user->plans->contains($id)) ? 'selected' : '' }}>{{ $plans }}</option>
                    @endforeach
                </select>
                @if($errors->has('plans'))
                    <div class="invalid-feedback">
                        {{ $errors->first('plans') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.roles.gender') }}</span>
            </div>

            <div class="form-group">
                <label class="required" for="geb">{{ trans('cruds.user.fields.gender') }}</label>
                {{--           <div style="padding-bottom: 4px">
                               <span class="btn btn-info btn-xs select-all" style="border-radius: 0">{{ trans('global.select_all') }}</span>
                               <span class="btn btn-info btn-xs deselect-all" style="border-radius: 0">{{ trans('global.deselect_all') }}</span>
                           </div>--}}
                <select data-placeholder="Gender" class="form-control  select2 {{ $errors->has('gender') ? 'is-invalid' : '' }}" name="gender" id="gender"  required>
                    <option value="" ></option>
                    <option {{ old('gender', $user->gender)==0   ? 'selected' : '' }} value="0" >ذكر</option>
                    <option {{ old('gender', $user->gender)==1   ? 'selected' : '' }} value="1" >أنثى</option>
                </select>
                @if($errors->has('gender'))
                    <div class="invalid-feedback">
                        {{ $errors->first('gender') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.gender_helper') }}</span>
            </div>
            <div class="form-group">
                <label class="required" for="phone">{{ trans('cruds.user.fields.phone') }}</label>
                <input class="form-control {{ $errors->has('phone') ? 'is-invalid' : '' }}" type="text" name="phone" id="phone" value="{{ old('phone', $user->phone) }}" required>
                @if($errors->has('phone'))
                    <div class="invalid-feedback">
                        {{ $errors->first('phone') }}
                    </div>
                @endif
                <span class="help-block">{{ trans('cruds.user.fields.phone_helper') }}</span>
            </div>
            <div class="form-group">
                <div class="image-input image-input-outline" id="kt_image_1">
                    <div class="image-input-wrapper" style="background-image: url(http://127.0.0.1:8000/assets/media/image_large.png)"></div>
                    <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" data-toggle="tooltip" title="" data-original-title="Change avatar">
                        <i class="fa fa-pen icon-sm text-muted"></i>
                        <input type="file" name="image" accept=".png, .jpg, .jpeg">
                        <input type="hidden" name="avatar">
                    </label>
                    <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="cancel" data-toggle="tooltip" title="" data-original-title="Cancel avatar">
															<i class="ki ki-bold-close icon-xs text-muted"></i>
														</span>
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
