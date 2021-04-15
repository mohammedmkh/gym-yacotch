<?php

namespace App\Models;

use \DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuotePlan extends Model
{
    use SoftDeletes;

    public $table = 'quote_plans';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'quote_id',
        'name',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class, 'quote_id');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
