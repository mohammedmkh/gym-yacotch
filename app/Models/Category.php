<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DateTimeInterface;
use Illuminate\Support\Facades\App;

class Category extends Model
{
    use SoftDeletes;

    public $table = 'categories';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'image',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }


    protected $appends = ['name' , 'image_url'] ;


    public function getImageUrlAttribute(){


        if($this->image != ''){
            return url('/').'/'.$this->image;
        }

        return url('assets/media/image_large.png');
    }

    public function getNameAttribute(){


        $language = App::getLocale();
        $language = Language::where('name' , $language)->first();
        $language = $language->id ?? 1 ;

        $values = $this->translation($language)->first()->values ;
        if( $values != ''){
            $values = json_decode($values) ;
        }
        $name = $values->name ?? '';
        return $name ;
    }


    public function getNameLang($language){
        $values = $this->translation($language)->first()->values ;
        if( $values != ''){
            $values = json_decode($values) ;
        }
        $name = $values->name ?? '';
        return $name ;
    }

    public function translation($language = null)
    {
        if($language){
            $language = Language::where('name' , $language)->first();
            $language = $language->id ?? 1 ;

            return $this->morphMany(Translation::class, 'transtable')->where('lang_id',  $language);
        }

        return $this->morphMany(Translation::class, 'transtable');

    }


}
