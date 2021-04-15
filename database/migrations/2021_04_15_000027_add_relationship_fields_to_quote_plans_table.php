<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToQuotePlansTable extends Migration
{
    public function up()
    {
        Schema::table('quote_plans', function (Blueprint $table) {
            $table->unsignedBigInteger('quote_id')->nullable();
            $table->foreign('quote_id', 'quote_fk_3686159')->references('id')->on('quotes');
        });
    }
}
