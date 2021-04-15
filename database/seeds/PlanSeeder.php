<?php

use Illuminate\Database\Seeder;
use App\Models\Plan;
class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            [
                'name'=>'plan1',
            ],
            [
                'name'=> 'plan2',
            ],
        ];

        Plan::insert($plans);
    }
}
