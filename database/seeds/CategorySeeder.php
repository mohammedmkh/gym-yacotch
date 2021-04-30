<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Translation;
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $category = new Category();
        $category->image = 'sssss';
        $category->name = 'sssss';
        $category->save();

        $trans = new Translation();
        $trans->values = '444';
        $trans->lang_id = '1';
        $trans->save();

        $category->translation()->save($trans);

    }
}
