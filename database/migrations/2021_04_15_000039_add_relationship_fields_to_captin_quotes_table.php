<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToCaptinQuotesTable extends Migration
{
    public function up()
    {
        Schema::table('captin_quotes', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_3686191')->references('id')->on('users');
            $table->unsignedBigInteger('quote_id')->nullable();
            $table->foreign('quote_id', 'quote_fk_3686192')->references('id')->on('quotes');
        });
    }
}
