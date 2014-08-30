<?php
namespace FXL\Bundle\MagicBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FXL\Component\Entity\Base\Base;

/**
 * @ORM\Entity(repositoryClass="FXL\Bundle\MagicBundle\Repository\NodeRepository")
 * @ORM\Table(name="magic__node")
 */
class Node extends Base
{
}
