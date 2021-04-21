<?php

use Illuminate\Database\Seeder;
use App\Models\Language;
class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Language::insert([['id'=>1,'name'=>'Arabic'],['id'=>2,'name'=>'English']]);
    }
}
