<?php

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionsTableSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            [
                'id'    => 1,
                'title' => 'user_management_access',
            ],
            [
                'id'    => 2,
                'title' => 'permission_create',
            ],
            [
                'id'    => 3,
                'title' => 'permission_edit',
            ],
            [
                'id'    => 4,
                'title' => 'permission_show',
            ],
            [
                'id'    => 5,
                'title' => 'permission_delete',
            ],
            [
                'id'    => 6,
                'title' => 'permission_access',
            ],
            [
                'id'    => 7,
                'title' => 'role_create',
            ],
            [
                'id'    => 8,
                'title' => 'role_edit',
            ],
            [
                'id'    => 9,
                'title' => 'role_show',
            ],
            [
                'id'    => 10,
                'title' => 'role_delete',
            ],
            [
                'id'    => 11,
                'title' => 'role_access',
            ],
            [
                'id'    => 12,
                'title' => 'user_create',
            ],
            [
                'id'    => 13,
                'title' => 'user_edit',
            ],
            [
                'id'    => 14,
                'title' => 'user_show',
            ],
            [
                'id'    => 15,
                'title' => 'user_delete',
            ],
            [
                'id'    => 16,
                'title' => 'user_access',
            ],
            [
                'id'    => 17,
                'title' => 'language_create',
            ],
            [
                'id'    => 18,
                'title' => 'language_edit',
            ],
            [
                'id'    => 19,
                'title' => 'language_show',
            ],
            [
                'id'    => 20,
                'title' => 'language_delete',
            ],
            [
                'id'    => 21,
                'title' => 'language_access',
            ],
            [
                'id'    => 22,
                'title' => 'category_create',
            ],
            [
                'id'    => 23,
                'title' => 'category_edit',
            ],
            [
                'id'    => 24,
                'title' => 'category_show',
            ],
            [
                'id'    => 25,
                'title' => 'category_delete',
            ],
            [
                'id'    => 26,
                'title' => 'category_access',
            ],
            [
                'id'    => 27,
                'title' => 'categories_tran_create',
            ],
            [
                'id'    => 28,
                'title' => 'categories_tran_edit',
            ],
            [
                'id'    => 29,
                'title' => 'categories_tran_show',
            ],
            [
                'id'    => 30,
                'title' => 'categories_tran_delete',
            ],
            [
                'id'    => 31,
                'title' => 'categories_tran_access',
            ],
            [
                'id'    => 32,
                'title' => 'advertice_create',
            ],
            [
                'id'    => 33,
                'title' => 'advertice_edit',
            ],
            [
                'id'    => 34,
                'title' => 'advertice_show',
            ],
            [
                'id'    => 35,
                'title' => 'advertice_delete',
            ],
            [
                'id'    => 36,
                'title' => 'advertice_access',
            ],
            [
                'id'    => 37,
                'title' => 'translation_create',
            ],
            [
                'id'    => 38,
                'title' => 'translation_edit',
            ],
            [
                'id'    => 39,
                'title' => 'translation_show',
            ],
            [
                'id'    => 40,
                'title' => 'translation_delete',
            ],
            [
                'id'    => 41,
                'title' => 'translation_access',
            ],
            [
                'id'    => 42,
                'title' => 'plan_create',
            ],
            [
                'id'    => 43,
                'title' => 'plan_edit',
            ],
            [
                'id'    => 44,
                'title' => 'plan_show',
            ],
            [
                'id'    => 45,
                'title' => 'plan_delete',
            ],
            [
                'id'    => 46,
                'title' => 'plan_access',
            ],
            [
                'id'    => 47,
                'title' => 'captin_create',
            ],
            [
                'id'    => 48,
                'title' => 'captin_edit',
            ],
            [
                'id'    => 49,
                'title' => 'captin_show',
            ],
            [
                'id'    => 50,
                'title' => 'captin_delete',
            ],
            [
                'id'    => 51,
                'title' => 'captin_access',
            ],
            [
                'id'    => 52,
                'title' => 'image_create',
            ],
            [
                'id'    => 53,
                'title' => 'image_edit',
            ],
            [
                'id'    => 54,
                'title' => 'image_show',
            ],
            [
                'id'    => 55,
                'title' => 'image_delete',
            ],
            [
                'id'    => 56,
                'title' => 'image_access',
            ],
            [
                'id'    => 57,
                'title' => 'reviews_clinet_create',
            ],
            [
                'id'    => 58,
                'title' => 'reviews_clinet_edit',
            ],
            [
                'id'    => 59,
                'title' => 'reviews_clinet_show',
            ],
            [
                'id'    => 60,
                'title' => 'reviews_clinet_delete',
            ],
            [
                'id'    => 61,
                'title' => 'reviews_clinet_access',
            ],
            [
                'id'    => 62,
                'title' => 'reviews_captin_create',
            ],
            [
                'id'    => 63,
                'title' => 'reviews_captin_edit',
            ],
            [
                'id'    => 64,
                'title' => 'reviews_captin_show',
            ],
            [
                'id'    => 65,
                'title' => 'reviews_captin_delete',
            ],
            [
                'id'    => 66,
                'title' => 'reviews_captin_access',
            ],
            [
                'id'    => 67,
                'title' => 'captin_certificate_create',
            ],
            [
                'id'    => 68,
                'title' => 'captin_certificate_edit',
            ],
            [
                'id'    => 69,
                'title' => 'captin_certificate_show',
            ],
            [
                'id'    => 70,
                'title' => 'captin_certificate_delete',
            ],
            [
                'id'    => 71,
                'title' => 'captin_certificate_access',
            ],
            [
                'id'    => 72,
                'title' => 'course_create',
            ],
            [
                'id'    => 73,
                'title' => 'course_edit',
            ],
            [
                'id'    => 74,
                'title' => 'course_show',
            ],
            [
                'id'    => 75,
                'title' => 'course_delete',
            ],
            [
                'id'    => 76,
                'title' => 'course_access',
            ],
            [
                'id'    => 77,
                'title' => 'trainee_course_create',
            ],
            [
                'id'    => 78,
                'title' => 'trainee_course_edit',
            ],
            [
                'id'    => 79,
                'title' => 'trainee_course_show',
            ],
            [
                'id'    => 80,
                'title' => 'trainee_course_delete',
            ],
            [
                'id'    => 81,
                'title' => 'trainee_course_access',
            ],
            [
                'id'    => 82,
                'title' => 'trainee_inforamation_create',
            ],
            [
                'id'    => 83,
                'title' => 'trainee_inforamation_edit',
            ],
            [
                'id'    => 84,
                'title' => 'trainee_inforamation_show',
            ],
            [
                'id'    => 85,
                'title' => 'trainee_inforamation_delete',
            ],
            [
                'id'    => 86,
                'title' => 'trainee_inforamation_access',
            ],
            [
                'id'    => 87,
                'title' => 'setting_create',
            ],
            [
                'id'    => 88,
                'title' => 'setting_edit',
            ],
            [
                'id'    => 89,
                'title' => 'setting_show',
            ],
            [
                'id'    => 90,
                'title' => 'setting_delete',
            ],
            [
                'id'    => 91,
                'title' => 'setting_access',
            ],
            [
                'id'    => 92,
                'title' => 'reportoncaptin_create',
            ],
            [
                'id'    => 93,
                'title' => 'reportoncaptin_edit',
            ],
            [
                'id'    => 94,
                'title' => 'reportoncaptin_show',
            ],
            [
                'id'    => 95,
                'title' => 'reportoncaptin_delete',
            ],
            [
                'id'    => 96,
                'title' => 'reportoncaptin_access',
            ],
            [
                'id'    => 97,
                'title' => 'report_ontrainee_create',
            ],
            [
                'id'    => 98,
                'title' => 'report_ontrainee_edit',
            ],
            [
                'id'    => 99,
                'title' => 'report_ontrainee_show',
            ],
            [
                'id'    => 100,
                'title' => 'report_ontrainee_delete',
            ],
            [
                'id'    => 101,
                'title' => 'report_ontrainee_access',
            ],
            [
                'id'    => 102,
                'title' => 'profile_password_edit',
            ],
        ];

        Permission::insert($permissions);
    }
}
