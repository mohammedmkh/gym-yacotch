<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $user_id
 * @property integer $category_id
 * @property integer $id
 * @property Category $category
 * @property User $user
 */
class captinCategorie extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'category_id', 'id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo('App\Category');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
