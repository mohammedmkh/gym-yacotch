<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OuathSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $outh = [
            [
                'id' => 3,
                'name' => '3',
                'secret' => 'FWE1VgIdcku3p3L9bRxpgXNLDw9sROLzoNab5kJv',
                'redirect'=>"http://localhost",
                'password_client'=>1,
                'provider'=>'users',
                'personal_access_client'=>0,
                'revoked'=>0
            ],
        ];

        DB::table('oauth_clients')->insert($outh);
    }
}
