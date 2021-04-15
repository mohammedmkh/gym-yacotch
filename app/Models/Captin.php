<?php

namespace App\Models;

use App\CaptinPlan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DateTimeInterface;
use Illuminate\Support\Facades\App;

class Captin extends Model
{
    use SoftDeletes;

    public $table = 'captins';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'bio',
        'image',
        'cv',
        'hours_cost',
        'user_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    protected $appends = ['name'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function getNameAttribute()
    {

         return $this->user->name;

    }
    public function CaptinPlan()
    {
        return $this->belongsToMany(CaptinPlan::class);
    }



}
