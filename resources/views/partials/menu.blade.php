<!--begin::Aside-->
<div class="aside aside-left aside-fixed d-flex flex-column flex-row-auto" id="kt_aside">
    <!--begin::Brand-->
    <div class="brand flex-column-auto" id="kt_brand">
        <!--begin::Logo-->
        <a href="{{ route("admin.home") }}" class="brand-logo">
            <img alt="Logo" class="w-65px" src="{{url('assets/media/logos/logo-letter-13.png')}}" />
        </a>
        <!--end::Logo-->
    </div>
    <!--end::Brand-->
    <!--begin::Aside Menu-->
    <div class="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
        <!--begin::Menu Container-->
        <div id="kt_aside_menu" class="aside-menu my-4" data-menu-vertical="1" data-menu-scroll="1" data-menu-dropdown-timeout="500">
            <!--begin::Menu Nav-->
            <ul class="menu-nav">





                <li class="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover">
                    <a href="javascript:;" class="menu-link menu-toggle">
                        <i class="menu-icon flaticon2-telegram-logo"></i>
                        <span class="menu-text">{{ trans('cruds.userManagement.title') }}</span>
                        <i class="menu-arrow"></i>
                    </a>
                    <div class="menu-submenu">
                        <i class="menu-arrow"></i>
                        <ul class="menu-subnav">

                            <li class="menu-item menu-item-parent" aria-haspopup="true">
												<span class="menu-link">
													<span class="menu-text">{{ trans('cruds.userManagement.title') }}</span>
												</span>
                            </li>
                            @can('permission_access')
                            <li class="menu-item" aria-haspopup="true">
                                <a href="{{ route("admin.permissions.index") }}" class="menu-link">
                                    <i class="menu-bullet menu-bullet-line">
                                        <span></span>
                                    </i>
                                    <span class="menu-text">      {{ trans('cruds.permission.title') }}</span>
                                </a>
                            </li>
                            @endcan
                            @can('role_access')
                            <li class="menu-item" aria-haspopup="true">
                                <a href="{{ route("admin.roles.index") }}" class="menu-link">
                                    <i class="menu-bullet menu-bullet-line">
                                        <span></span>
                                    </i>
                                    <span class="menu-text"> {{ trans('cruds.role.title') }}</span>
                                </a>
                            </li>
                            @endcan

                            @can('user_access')
                                <li class="menu-item" aria-haspopup="true">
                                    <a href="{{ route("admin.users.index") }}" class="menu-link">
                                        <i class="menu-bullet menu-bullet-line">
                                            <span></span>
                                        </i>
                                        <span class="menu-text"> {{ trans('cruds.user.title') }}</span>
                                    </a>
                                </li>
                            @endcan

                        </ul>
                    </div>
                </li>
                @can('category_access')
                <li class="menu-item" aria-haspopup="true">
                    <a href="{{ route("admin.categories.index") }}" class="menu-link">
                        <i class="menu-icon flaticon2-console"></i>
                        <span class="menu-text"> {{ trans('cruds.category.title') }}</span>
                    </a>
                </li>
                @endcan

                @can('advertice_access')
                <li class="menu-item" aria-haspopup="true">
                    <a href="{{ route("admin.advertices.index") }}" class="menu-link">
                        <i class="menu-icon flaticon2-console"></i>
                        <span class="menu-text"> {{ trans('cruds.advertice.title') }}</span>
                    </a>
                </li>
                @endcan


                <li class="menu-item" aria-haspopup="true">
                    <a href="#" class="menu-link">
                        <i class="menu-icon flaticon2-graph-1"></i>
                        <span class="menu-text">Logs</span>
                    </a>
                </li>

            </ul>
            <!--end::Menu Nav-->
        </div>
        <!--end::Menu Container-->
    </div>
    <!--end::Aside Menu-->
</div>
<!--end::Aside-->