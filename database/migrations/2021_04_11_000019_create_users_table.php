<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('email')->nullable()->unique();
            $table->datetime('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('remember_token')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('sms_code')->nullable();
            $table->string('gender')->nullable();
            $table->string('avatar')->nullable();
            $table->string('lat')->nullable();
            $table->string('long')->nullable();
            $table->unsignedBigInteger('role')->nullable();
            /*            $table->foreign('role', 'user_fk_3643296')->references('id')->on('roles');*/

            $table->tinyInteger('verify')->default(0);
            $table->tinyInteger('is_reset')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
