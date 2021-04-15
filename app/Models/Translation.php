<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DateTimeInterface;

class Translation extends Model
{


    public $table = 'translations';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'lang_id',
        'transtable_type',
        'transtable_id',
        'values',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function lang()
    {
        return $this->belongsTo(Language::class, 'lang_id');
    }

    public function transtable()
    {
        return $this->morphTo();
    }
}
